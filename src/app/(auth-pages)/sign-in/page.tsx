import { Message } from "@/components/form-message";
import SignIn from "./SignIn";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return <SignIn searchParams={searchParams} />;
}
