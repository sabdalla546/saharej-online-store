"use client";

import { setting } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useTransition } from "react";

interface UserInfoProps {
  user?: User;
  label: string;
}
const UserInfo = ({ user, label }: UserInfoProps) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      setting({
        name: "new name",
      }).then(() => {
        update();
      });
    });
  };
  return (
    <div className="flex flex-col gap-y-3">
      <Card>
        <CardHeader>
          <p className="text-2xl text-semibold ">{label}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium"> ID </p>
            <p className="truncate text-xs  max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.id}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium"> NAME </p>
            <p className="truncate text-xs  max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.name}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium"> EMAIL </p>
            <p className="truncate text-xs  max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.email}
            </p>
          </div>
        </CardContent>
      </Card>
      {/*   <Card>
        <CardHeader className="text-2xl text-semibold">Settings</CardHeader>
        <CardContent>
          <Button disabled={isPending} onClick={onClick}>
            Update
          </Button>
        </CardContent>
      </Card>*/}
    </div>
  );
};

export default UserInfo;
