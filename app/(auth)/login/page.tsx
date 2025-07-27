"use client";

import { useRouter } from "next/navigation";
import { Button, Checkbox, Flex, Form, Input, InputRef, message } from "antd";
import { LoginDto } from "@/dtos";
import { useEffect, useRef } from "react";
import { userLogin } from "@/actions/auth";

type LoginForm = LoginDto & { remember?: boolean };

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm<LoginForm>();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const loginData = localStorage.getItem("user_login");

    if (loginData) {
      form.setFieldsValue(JSON.parse(loginData) as LoginDto);
    }
    return () => {
      return;
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus({
        cursor: "start",
      });
    }
  }, [inputRef]);

  const handleSubmit = async (formData: LoginForm) => {
    try {
      const result = await userLogin({
        username: formData.username,
        password: formData.password,
      });

      if (result.success) {
        formData.remember &&
          localStorage.setItem("user_login", JSON.stringify(formData));
        localStorage.setItem("user", JSON.stringify(result.data));
        message.success(" Login successfully, navigating to app!");
        router.push("/");
      }
    } catch (err) {
      message.error((err as Error).message);
    }
  };

  return (
    <Flex gap="middle" vertical align="center" justify="center">
      <Form onFinish={handleSubmit} form={form}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true }]}
        >
          <Input autoFocus tabIndex={0} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
