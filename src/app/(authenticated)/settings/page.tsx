"use client";
import { useAppStore } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { CONFIG, BASE_URL } from "@/lib/config";
import { useToast } from "@/components/common/toast/toast-context";
import { useRouter } from "next/navigation";


interface StakeItem {
  stakeName: string;
  stakeAmount: number | string;
}

interface StakeData {
  userId: string;
  stake: StakeItem[];
}

export default function Settings() {
  const { showToast } = useToast();
  const { stakeValue, setStakeValue } = useAppStore();
  const [stakeitems, setStakeItems] = useState<StakeData | null>(null);
  const router = useRouter()


  useEffect(() => {
    console.log(stakeValue, "hello");

    const eventsType = stakeValue?.stake;
    if (!eventsType) return;
    setStakeItems(stakeValue);
  }, [stakeValue]);

  const handleChange = (index: any, newValue: any) => {
    if (!stakeitems) return;
    const updatedStakes = [...stakeitems.stake];
    updatedStakes[index] = {
      ...updatedStakes[index],
      stakeAmount: newValue
    };

    setStakeItems({
      ...stakeitems,
      stake: updatedStakes
    });
  };

  const handleUpdateClick = async () => {
    if (!stakeitems) return;

    try {
      const token = localStorage.getItem("token");
      const fullURL = `${BASE_URL}${CONFIG.userUpdateStackValueURL}`;
      const payloadObject: any = {};

      stakeitems.stake.forEach((item) => {
        console.log("first", item)
        payloadObject[item.stakeAmount] = item.stakeAmount.toString();
      });
      console.log("stake payload ", payloadObject)
      const stakeString = JSON.stringify(payloadObject);

      console.log("Sending Payload:", stakeString);

      const response = await fetch(fullURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          stake: stakeString,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error && data?.meta?.status !== false) {
        setStakeValue(stakeitems);
        showToast("success", "Success", "Stake Updated Successfully!");
        router.push('/')
      } else {
        showToast(
          "error",
          "Error",
          data?.meta?.message || data?.message || "Failed to update stake"
        );
      }
    } catch (error) {
      console.error("Error updating stake:", error);
      showToast("error", "Network Error", "Unable to update stake");
    }
  };


  return (
    <div className="md:mx-[5px] md:my-[6px]">
      <div className="bg-white shadow rounded ">
        <div className="bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]
                        text-white h-[33px] flex items-center px-3.5 rounded-t">
          <h4 className="text-[20px] font-bold font-roboto bottom-0.5">Update Stake</h4>
        </div>
        <div className="px-1 py-4">
          <div className="mb-[9px] pl-1">
            <p className="text-[14px] -ml-0.5">
              <b className="text-[16px]">Stake Amount</b>
            </p>
          </div>
          <div className="grid grid-cols-4 gap-x-2 md:gap-x-[10px] md:gap-y-[6px] w-full md:w-1/2 pl-1">
            {(stakeitems?.stake ?? []).map((item, i) => (
              <input
                key={i}
                type="text"
                value={item.stakeAmount}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="0"
                maxLength={9}
                className="border border-[#f4b501] shadow-[0_0_2px] md:shadow-none md:border-[#dee2e6] rounded text-[black] text-center h-[38px] text-[16px]"
              />
            ))}
          </div>
          <div className="mt-3 pl-1">
            <button
              onClick={handleUpdateClick}
              className="w-full md:w-[221.5px] md:w-1/4 h-[38px] text-[16px] 
                         bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)]
                         text-black rounded-[1px]"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
