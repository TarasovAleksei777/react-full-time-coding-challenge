import React, { FC, useCallback, useState } from "react";
import { Task } from "@/index";
import { Button, notification, Popconfirm, Space, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { EditPatientModal } from "./EditPatientModal";
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import { PatientMedicationRowExpansion } from "./PatientMedicationRowExpansion";
import { Maybe, Patient } from "@/__generated__/graphql-generated";
import { TaskWrapper } from "@/components/TaskWrapper";
import { useMutation, useQuery } from "@apollo/client";
import {
  AddPatientMutation,
  DeletePatientMutation,
  ListPatientsQuery,
} from "@/queries/graphql-queries";
import { buildFullName } from "@/utils/formatters";

/**
 * The component `PatientList` consists of a table, a modal to edit a patient and a row expansion.
 * The table contains the properties of: name, date of birth and sex (address omitted).
 * Implement the calls `delete` and `create` patients in this component. Make sure that you don't refetch the list
 * after those operations. Use local cache updates instead.
 *
 * Please document your changes.
 */
export const PatientList: FC<Task> = (task) => {
  const [patient, setPatient] = useState<Patient | null>();

  /** Editable Code START **/
  const { data } = useQuery(ListPatientsQuery);
  const [deletePatient] = useMutation(DeletePatientMutation, {
    update(cache, { data }) {
      // Retrieve the current list of patients from the cache
      const existingPatients = cache.readQuery<{
        listPatients: Maybe<Patient>[];
      }>({
        query: ListPatientsQuery,
      });

      // If there are patient data in the cache and a patient is successfully deleted
      if (existingPatients && data?.deletePatient) {
        // Update the cache by removing the deleted patient from the list
        cache.writeQuery({
          query: ListPatientsQuery,
          data: {
            listPatients: existingPatients.listPatients.filter(
              (patient) => patient?.id !== data.deletePatient,
            ),
          },
        });
      }
    },
  });

  const patients: Maybe<Maybe<Patient>[]> = data?.listPatients || [];
  const [addPatient] = useMutation(AddPatientMutation, {
    update(cache, { data }) {
      // Retrieve the current list of patients from the cache
      const existingPatients = cache.readQuery<{
        listPatients: Maybe<Patient>[];
      }>({
        query: ListPatientsQuery,
      });

      // If there are patient data in the cache and a patient is successfully added
      if (existingPatients && data?.createPatient) {
        const newPatient: Patient = {
          __typename: "Patient",
          id: data?.createPatient.id,
          name: {
            firstName: "",
            lastName: "",
          },
          dateOfBirth: null,
          sex: null,
        };
        // Update the cache
        cache.writeQuery({
          query: ListPatientsQuery,
          data: {
            listPatients: [...existingPatients.listPatients, newPatient],
          },
        });
      }
    },
  });

  const handleAdd = () => {
    addPatient()
      .then((response) => {
        const newPatientId = response.data?.createPatient?.id;
        if (newPatientId) {
          notification.success({
            message: `New patient created with ID ${newPatientId}`,
          });
        } else {
          notification.error({ message: "Failed to create new patient" });
        }
      })
      .catch((error) => {
        notification.error({
          message: `Failed to create new patient: ${error.message}`,
        });
      });
  };
  const handleDelete = (patientId: string) => {
    deletePatient({ variables: { id: patientId } })
      .then(() => {
        notification.success({
          message: `Patient with ID ${patientId} deleted successfully`,
        });
      })
      .catch((error) => {
        notification.error({
          message: `Failed to delete patient: ${error.message}`,
        });
      });
  };

  const mockName = "The name is not filled in";
  const getFullName = useCallback(
    (id: Maybe<string>) => {
      const currentPatient = patients?.find((item) => item?.id === id);
      const fullCurrentName = buildFullName(currentPatient?.name || {});
      return fullCurrentName.length ? fullCurrentName : mockName;
    },
    [patients, mockName],
  );

  const columns: ColumnProps<Patient>[] = [
    {
      key: "patientsName",
      title: "Patient's name",
      render: (_, patient) => (
        <Space
          style={{
            color: getFullName(patient.id) === mockName ? "red" : "black",
          }}
        >
          {getFullName(patient.id)}
        </Space>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, patient) => (
        <Space>
          <EditTwoTone
            className={"cursor-pointer"}
            onClick={() => setPatient(patient)}
          />
          <Popconfirm
            title={`Delete ${getFullName(patient.id)}`}
            onConfirm={() => handleDelete(patient.id!)}
          >
            <DeleteTwoTone twoToneColor={"red"} className={"cursor-pointer"} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /** Editable Code END **/

  return (
    <TaskWrapper task={task}>
      <div className={"w-full"}>
        <Table
          rowKey={"id"}
          columns={columns}
          dataSource={patients?.map((patient) => patient!)}
          pagination={false}
          expandable={{
            expandedRowRender: (patient) => (
              <PatientMedicationRowExpansion patientId={patient.id} />
            ),
          }}
        />
        <EditPatientModal
          open={!!patient}
          onClose={() => setPatient(null)}
          patient={patient}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}
          block
          type={"dashed"}
        >
          Add Patient
        </Button>
      </div>
    </TaskWrapper>
  );
};
