import dynamic from "next/dynamic";
import React from "react";

const MTipsPreview = dynamic(() => import("@/components/m-view/m-tipsPreview"), {
  loading: () => <></>,
});

export default function MTipsReview() {
  return (
    <div>
      <MTipsPreview />
    </div>
  );
}
