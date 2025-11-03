// React Email template для верификации email
// T037: React Email verification template

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface VerificationEmailProps {
  email: string;
  verificationUrl: string;
}

export default function VerificationEmail({ email, verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Подтвердите свой email адрес</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>Добро пожаловать в Free Diet!</Heading>
            <Text style={text}>Здравствуйте! Спасибо за регистрацию в Free Diet.</Text>
            <Text style={text}>
              Для активации вашего аккаунта, пожалуйста, подтвердите email адрес{" "}
              <strong>{email}</strong>, нажав на кнопку ниже:
            </Text>
            <Button style={button} href={verificationUrl}>
              Подтвердить Email
            </Button>
            <Text style={text}>Или скопируйте эту ссылку в ваш браузер:</Text>
            <Text style={link}>{verificationUrl}</Text>
            <Hr style={hr} />
            <Text style={footer}>
              Эта ссылка действительна в течение 24 часов. Если вы не регистрировались в Free Diet,
              просто проигнорируйте это письмо.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Стили
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#1890ff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "16px 0",
};

const link = {
  color: "#1890ff",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
