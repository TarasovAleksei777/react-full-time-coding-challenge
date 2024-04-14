import React from "react";
import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useFormik } from "formik";
import { Task } from "@/index";
import { buildFullName } from "@/utils/formatters";
import { TaskWrapper } from "@/components/TaskWrapper";
import { NameFragment, Sex } from "@/__generated__/graphql-generated";
import { Maybe } from "@graphql-tools/utils";

/**I rewrote this component using useFormik, as it is a better
 * solution than storing multiple useStates with custom validation.**/
interface FormValues {
  title: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  sex: Maybe<Sex>;
}

export const InputForms: React.FC<Task> = (task) => {
  const initialValues: FormValues = {
    title: "",
    firstName: "",
    middleNames: "",
    lastName: "",
    sex: null,
  };

  const onSubmit = (values: FormValues) => {
    const patientName: NameFragment = {
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.title,
      middleNames: values.middleNames.split(" "),
    };
    // Don't change the alert
    alert(`${buildFullName(patientName)} ${values.sex}`);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate: (values) => {
      const errors: Partial<FormValues> = {};
      if (!values.firstName.trim()) {
        errors.firstName = "Required";
      }
      if (!values.lastName.trim()) {
        errors.lastName = "Required";
      }
      return errors;
    },
  });

  return (
    <TaskWrapper task={task}>
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Title" required>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="First name" required>
              <Input
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Middle names">
              <Input
                name="middleNames"
                value={formik.values.middleNames}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last name" required>
              <Input
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
            <Button type="primary" htmlType="submit" disabled={!formik.isValid}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </TaskWrapper>
  );
};
