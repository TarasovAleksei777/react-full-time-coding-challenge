import React, { FC } from "react";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Radio,
  Space,
} from "antd";
import { Maybe, Patient, Sex } from "@/__generated__/graphql-generated";
import { buildFullName } from "@/utils/formatters";
import dayjs from "dayjs";
import { usePatientForm } from "@/queries/hook";
import { useQuery } from "@apollo/client";
import { GetPatientQuery } from "@/queries/graphql-queries";

interface PatientPreviewProps {
  patient: Maybe<Patient>;
  open: boolean;
  onClose: () => void;
}

export const EditPatientModal: FC<PatientPreviewProps> = ({
  onClose,
  open,
  patient,
}) => {
  const { data } = useQuery(GetPatientQuery, {
    variables: { id: patient?.id },
    skip: !patient?.id,
  });

  const existedPatient = data?.getPatient;
  const { formik } = usePatientForm(onClose, existedPatient);

  const handleCloseModal = () => {
    onClose();
    formik.resetForm();
  };

  const onChange: DatePickerProps["onChange"] = (_date, dateString) => {
    formik.setFieldValue("dateOfBirth", dateString);
  };
  const datePickerValue = formik.values.dateOfBirth || null;
  return (
    <Modal
      open={open}
      onCancel={handleCloseModal}
      title={existedPatient?.name && buildFullName(existedPatient?.name)}
      footer={null}
    >
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <Form.Item label="First Name">
          <Input
            name={"name.firstName"}
            onChange={formik.handleChange}
            value={formik.values?.name?.firstName || ""}
          />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input
            name={"name.lastName"}
            onChange={formik.handleChange}
            value={formik.values?.name?.lastName || ""}
          />
        </Form.Item>
        <Form.Item label="City">
          <Input
            name={"address.city"}
            onChange={formik.handleChange}
            value={formik.values?.address?.city || ""}
          />
        </Form.Item>
        <Form.Item label="Street">
          <Input
            name={"address.street"}
            onChange={formik.handleChange}
            value={formik.values?.address?.street || ""}
          />
        </Form.Item>
        <Form.Item label="House Number">
          <Input
            name={"address.houseNumber"}
            onChange={formik.handleChange}
            value={formik.values?.address?.houseNumber || ""}
          />
        </Form.Item>
        <Form.Item label="Addition">
          <Input
            name={"address.addition"}
            onChange={formik.handleChange}
            value={formik.values?.address?.addition || ""}
          />
        </Form.Item>
        <Form.Item label="Sex">
          <Radio.Group
            name="sex"
            value={formik.values.sex}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <Radio.Button value={Sex.Male}>Male</Radio.Button>
            <Radio.Button value={Sex.Female}>Female</Radio.Button>
            <Radio.Button value={Sex.Diverse}>Diverse</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Date of Birth">
          <DatePicker
            name={"dateOfBirth"}
            onChange={onChange}
            value={datePickerValue ? dayjs(datePickerValue) : null}
          />
        </Form.Item>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>

          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
