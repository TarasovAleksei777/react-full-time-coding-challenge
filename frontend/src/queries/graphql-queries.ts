import { gql } from "@apollo/client";

// Query to list patients with relevant properties
export const ListPatientsQuery = gql`
  query ListPatients {
    listPatients {
      id
      name {
        firstName
        lastName
      }
      dateOfBirth
      sex
    }
  }
`;

// Query to get a patient by ID with all properties
export const GetPatientQuery = gql`
  query GetPatient($id: String!) {
    getPatient(id: $id) {
      id
      name {
        firstName
        lastName
      }
      dateOfBirth
      sex
      address {
        city
        street
        houseNumber
      }
    }
  }
`;

// Mutation to update a patient object
export const UpdatePatientMutation = gql`
  mutation UpdatePatient($patient: PatientInput!) {
    updatePatient(patient: $patient) {
      id
      name {
        firstName
        lastName
      }
      dateOfBirth
      sex
      address {
        city
        street
        houseNumber
      }
    }
  }
`;

// Mutation to delete a patient by ID
export const DeletePatientMutation = gql`
  mutation DeletePatient($id: String!) {
    deletePatient(id: $id)
  }
`;

// Mutation to add a patient with just the ID property set
export const AddPatientMutation = gql`
  mutation createPatient {
    createPatient {
      id
    }
  }
`;

// Query to get a patient's list of Medication
export const GetPatientMedicationQuery = gql`
  query listPatientMedications($id: String!) {
    listPatientMedications(patientId: $id) {
      brand
      labeler
      packageCode
      patientId
      productCode
    }
  }
`;
