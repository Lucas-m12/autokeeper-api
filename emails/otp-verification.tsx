import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OTPVerificationEmailProps {
  userName: string;
  otp: string;
}

export const OTPVerificationEmail = ({
  userName,
  otp,
}: OTPVerificationEmailProps) => (
  <Html lang="pt-BR">
    <Head />
    <Preview>Seu código de verificação: {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header / Logo */}
        <Section style={header}>
          <div style={logoIcon}>🚗</div>
          <Heading style={brandName}>AutoKeeper</Heading>
          <Text style={tagline}>Gestão Inteligente de Veículos</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Olá, {userName}! 👋</Text>
          <Heading as="h2" style={h2}>
            Verificação de Email
          </Heading>

          <Text style={text}>
            Para confirmar seu endereço de email e ativar sua conta no
            AutoKeeper, utilize o código de verificação abaixo:
          </Text>

          {/* OTP Code Box */}
          <Section style={otpBox}>
            <Text style={otpLabel}>Seu código de verificação:</Text>
            <Text style={otpCode}>{otp}</Text>
            <Text style={otpExpiry}>⏱️ Expira em 5 minutos</Text>
          </Section>

          <Text style={textSecondary}>
            Se você não solicitou este código, por favor ignore este email. Sua
            conta permanecerá segura.
          </Text>

          {/* Security Tips */}
          <Section style={securityBox}>
            <Text style={securityTitle}>🛡️ Dicas de Segurança</Text>
            <Text style={securityText}>
              • Nunca compartilhe este código com ninguém
              <br />
              • A AutoKeeper nunca pedirá seu código por telefone
              <br />• Este código é válido apenas uma vez
            </Text>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Precisa de ajuda?{" "}
            <Link href="mailto:suporte@autokeeper.app" style={footerLink}>
              suporte@autokeeper.app
            </Link>
          </Text>
          <Text style={footerTextMuted}>
            © {new Date().getFullYear()} AutoKeeper. Todos os direitos
            reservados.
            <br />
            Este é um email automático, por favor não responda.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

OTPVerificationEmail.PreviewProps = {
  userName: "João Silva",
  otp: "123456",
} as OTPVerificationEmailProps;

export default OTPVerificationEmail;

// ============================================
// STYLES - AutoKeeper Design System v1.0
// ============================================

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  backgroundColor: "#0a0a0a",
  padding: "40px 20px",
};

const container = {
  margin: "0 auto",
  padding: "48px 32px",
  maxWidth: "600px",
  backgroundColor: "#121212",
  borderRadius: "24px",
  border: "1px solid rgba(34, 211, 238, 0.2)",
};

// Header
const header = {
  textAlign: "center" as const,
  paddingBottom: "32px",
  borderBottom: "1px solid rgba(34, 211, 238, 0.15)",
  marginBottom: "32px",
};

const logoIcon = {
  width: "64px",
  height: "64px",
  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
  borderRadius: "18px",
  margin: "0 auto 16px",
  fontSize: "32px",
  lineHeight: "64px",
  textAlign: "center" as const,
  boxShadow: "0 8px 32px rgba(6, 182, 212, 0.3)",
};

const brandName = {
  margin: "0 0 4px 0",
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700" as const,
  letterSpacing: "-0.5px",
};

const tagline = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "0",
  fontWeight: "500" as const,
};

// Content
const content = {
  paddingBottom: "24px",
};

const greeting = {
  fontSize: "16px",
  fontWeight: "500" as const,
  color: "#22d3ee",
  margin: "0 0 8px 0",
};

const h2 = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#ffffff",
  margin: "0 0 24px 0",
  lineHeight: "1.3",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#f1f5f9",
  margin: "0 0 24px 0",
};

const textSecondary = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#9ca3af",
  margin: "0 0 24px 0",
};

// OTP Box
const otpBox = {
  backgroundColor: "rgba(6, 182, 212, 0.08)",
  border: "2px solid rgba(34, 211, 238, 0.3)",
  borderRadius: "16px",
  padding: "32px 24px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const otpLabel = {
  margin: "0 0 12px 0",
  fontSize: "14px",
  color: "#9ca3af",
  fontWeight: "500" as const,
};

const otpCode = {
  fontSize: "40px",
  fontWeight: "700" as const,
  letterSpacing: "12px",
  color: "#06b6d4",
  fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
  margin: "0 0 12px 0",
  textShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
};

const otpExpiry = {
  margin: "0",
  fontSize: "13px",
  color: "#f59e0b",
  fontWeight: "500" as const,
};

// Security Box
const securityBox = {
  backgroundColor: "rgba(30, 30, 30, 0.6)",
  border: "1px solid rgba(34, 211, 238, 0.15)",
  borderRadius: "12px",
  padding: "20px",
};

const securityTitle = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#22d3ee",
  margin: "0 0 12px 0",
};

const securityText = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#9ca3af",
  margin: "0",
};

// Footer
const hr = {
  borderColor: "rgba(34, 211, 238, 0.15)",
  borderWidth: "1px",
  margin: "0 0 24px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "0 0 12px 0",
};

const footerLink = {
  color: "#22d3ee",
  textDecoration: "none",
  fontWeight: "500" as const,
};

const footerTextMuted = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0",
  lineHeight: "1.6",
};

OTPVerificationEmail.PreviewProps = {
  userName: "João Silva",
  otp: "123456",
} as OTPVerificationEmailProps;

