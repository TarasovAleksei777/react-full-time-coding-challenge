import { useFormik } from "formik";
import { InputMaybe, PatientInput } from "@/__generated__/graphql-generated";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UpdatePatientMutation } from "@/queries/graphql-queries";
import { notification } from "antd";

function getConfigurationForm(
  editedValues: InputMaybe<PatientInput>,
): PatientInput {
  return {
    id: editedValues?.id || "",
    name: {
      firstName: editedValues?.name?.firstName || "",
      lastName: editedValues?.name?.lastName || "",
    },
    sex: editedValues?.sex || null,
    address: {
      city: editedValues?.address?.city || "",
      street: editedValues?.address?.street || "",
      houseNumber: editedValues?.address?.houseNumber || "",
      addition: editedValues?.address?.addition || "",
    },
    dateOfBirth: editedValues?.dateOfBirth || null,
  };
}

export function usePatientForm(
  closePopup: () => void,
  editedValues: InputMaybe<PatientInput>,
) {
  const initialValues = getConfigurationForm(editedValues);

  useEffect(() => {
    formik.setValues(initialValues);
  }, [editedValues]);

  const [updatePatient] = useMutation(UpdatePatientMutation);

  const handleUpdate = (patient: PatientInput) => {
    updatePatient({ variables: { patient } })
      .then(() => {
        notification.success({
          message: `Patient with ID ${patient.id} was updated successfully`,
        });
      })
      .catch((error) => {
        notification.error({
          message: `Failed to update patient: ${error.message}`,
        });
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      try {
        handleUpdate(values);
        closePopup();
      } catch (error) {
        notification.error({ message: "Something's wrong" });
      }
    },
  });

  return { formik };
}
