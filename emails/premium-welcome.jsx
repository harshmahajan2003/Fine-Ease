import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from "@react-email/components";

export default function PremiumWelcomeEmail({
    userName = "User",
    receiptUrl = "#",
}) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Fine Ease Premium! 🎉</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={headerSection}>
                        <Heading style={heading}>🎉 Welcome to Premium!</Heading>
                    </Section>

                    {/* Content */}
                    <Section style={contentSection}>
                        <Text style={text}>
                            Hi {userName},
                        </Text>
                        <Text style={text}>
                            Thank you for upgrading to <strong>Fine Ease Premium</strong>!
                            Your subscription is now active and you have access to all premium features.
                        </Text>

                        <Heading as="h3" style={subheading}>
                            What you&apos;ve unlocked:
                        </Heading>

                        <ul style={list}>
                            <li style={listItem}>✨ <strong>AI Receipt Scanner</strong> - Automatically extract transaction data from receipts</li>
                            <li style={listItem}>📊 <strong>Advanced Analytics</strong> - Detailed spending insights and trends</li>
                            <li style={listItem}>📥 <strong>Export to CSV/PDF</strong> - Download your financial data anytime</li>
                            <li style={listItem}>🎯 <strong>Priority Support</strong> - Get help when you need it</li>
                        </ul>

                        <Hr style={hr} />

                        <Heading as="h3" style={subheading}>
                            Your Payment Receipt
                        </Heading>
                        <Text style={text}>
                            You can download your payment receipt anytime by clicking the button below:
                        </Text>

                        <Button style={button} href={receiptUrl}>
                            Download Receipt
                        </Button>

                        <Hr style={hr} />

                        <Text style={footerText}>
                            Your subscription will automatically renew each month.
                            You can manage or cancel your subscription anytime from the Pricing page.
                        </Text>

                        <Text style={footerText}>
                            If you have any questions, feel free to reply to this email.
                        </Text>

                        <Text style={signature}>
                            — The Fine Ease Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    maxWidth: "600px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const headerSection = {
    background: "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
    padding: "40px 20px",
    textAlign: "center",
};

const heading = {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
};

const contentSection = {
    padding: "32px",
};

const text = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 0",
};

const subheading = {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "24px 0 16px 0",
};

const list = {
    padding: "0",
    margin: "0",
    listStyle: "none",
};

const listItem = {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "28px",
    padding: "4px 0",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
};

const button = {
    backgroundColor: "#7c3aed",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
    textAlign: "center",
};

const footerText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "8px 0",
};

const signature = {
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "24px",
};
