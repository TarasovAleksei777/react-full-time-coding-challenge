import React, { FC } from "react";
import { Alert, Table } from "antd";
import { Maybe, Medication } from "@/__generated__/graphql-generated";
import { GetPatientMedicationQuery } from "@/queries/graphql-queries";
import { useQuery } from "@apollo/client";
import { ColumnProps } from "antd/es/table";
import { getNDC } from "@/utils/formatters";

interface PatientMedicationRowExpansion {
  patientId: Maybe<string>;
}

/**
 * Task: Patient medication
 *
 * The `PatientMedicationRowExpansion` lists all the medications of a patient as a nested table.
 * The format of a medication has to follow the [NDC Standard](https://en.wikipedia.org/wiki/National_drug_code) and must be dash separated
 * and should also contain the brand name as a separate column.
 *
 * Hint: Medications don't contain ids. In order to keep the apollo cache stable you have to modify the file `apollo-setup.ts`. A medications
 * identifier could be derived combining the `patientId` + `labeler` + `productCode` + `packageCode`.
 *
 * Note: Only the first patient contains medications.
 *
 * Please document your changes.
 */
export const PatientMedicationRowExpansion: FC<
  PatientMedicationRowExpansion
> = ({ patientId }) => {
  /** Editable Code START **/
  const { data, loading, error } = useQuery(GetPatientMedicationQuery, {
    variables: { id: patientId },
    skip: !patientId,
  });

  if (loading) return <Alert message="Loading medications..." type="info" />;
  if (error) return <Alert message="Error loading medications" type="error" />;

  const medications: Maybe<Medication>[] = data?.listPatientMedications || [];
  const columns: ColumnProps<Medication>[] = [
    {
      key: "ndcStandard",
      title: "NDC Standard",
      render: (_, medication) => <div>{getNDC(medication)}</div>,
    },
    {
      key: "brandName",
      title: "Brand Name",
      render: (_, medication) => <div>{medication.brand}</div>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={medications?.map((medication) => medication!)}
      pagination={false}
    />
  );
};
/** Editable Code END **/
