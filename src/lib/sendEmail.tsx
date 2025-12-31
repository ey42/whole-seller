import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  userFirstname?: string;
  verifyUrl?: string;
}

export const sendEmail = ({
  userFirstname = "User",
  verifyUrl = "https://whole-seller.com",
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email for Eyob Shop</Preview>
      <Tailwind>
        <Body className="bg-[#050505] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#222] rounded-xl my-10 mx-auto p-5 max-w-116.25 bg-[#0f0f0f]">
            <Section className="mt-[32px] text-center">
                <Text className="text-[#22c55e] text-[24px] font-bold tracking-tighter">
                  EYOB SHOP
                </Text>
            </Section>
            <Heading className="text-white text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Confirm your <strong>Email</strong>
            </Heading>
            <Text className="text-[#a1a1aa] text-[14px] leading-[24px]">
              Hello {userFirstname},
            </Text>
            <Text className="text-[#a1a1aa] text-[14px] leading-[24px]">
              We're excited to have you! Before you start shopping, please click the button below to verify your account.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#22c55e] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 cursor-pointer"
                href={verifyUrl}
              >
                Verify Account
              </Button>
            </Section>
            <Text className="text-[#71717a] text-[12px] leading-[24px]">
              Or copy and paste this URL into your browser:{" "}
              <a href={verifyUrl} className="text-[#22c55e] no-underline">
                {verifyUrl}
              </a>
            </Text>
            <Hr className="border border-solid border-[#222] my-[26px] mx-0 w-full" />
            <Text className="text-[#52525b] text-[12px] leading-[24px] text-center">
              Addis Ababa, Ethiopia. If you didn't request this, ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};