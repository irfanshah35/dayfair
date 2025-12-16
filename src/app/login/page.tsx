import dynamic from "next/dynamic";
import React from "react";

const MLoginPage = dynamic(() => import("@/components/m-view/m-login"), {
  loading: () => <></>,
});

export default function Login() {
  return (
    <div>
      <MLoginPage />
    </div>
  );
}
