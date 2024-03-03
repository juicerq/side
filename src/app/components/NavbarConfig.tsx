import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type User } from "@/server/db/ZSchemasAndTypes";
import { api } from "@/trpc/react";
import { MoreVertical, Settings, SunMoon, UserRoundCog } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

interface NavbarConfigProps {
  user: User;
  setUser: (user: User) => void;
}

export function NavbarConfig({ user, setUser }: NavbarConfigProps) {
  const { mutate: updateUser } = api.user.update.useMutation({
    onSuccess: (response) => {
      setUser(response.updatedUser);
      toast("Role changed successfully", {
        position: "bottom-center",
        description: "Your new role is " + response.updatedUser.role,
      });
    },
    onError: (err) => {
      toast(err.message, {
        position: "bottom-center",
      });
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreVertical className="size-9 ml-4 hover:bg-secondary rounded-md p-1 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-[350px] space-y-4 divide-y mr-8">
        <div className="flex text-muted-foreground gap-2 items-center">
          <div className="p-2 rounded-lg bg-secondary">
            <Settings className="size-5" />
          </div>
          <div>
            <h3 className="text-primary font-medium">Your configurations</h3>
            <p className="text-xs font-medium">
              You can change your settings here
            </p>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center pl-2 gap-4">
            <div className="flex gap-3 items-center">
              <UserRoundCog className="size-6" />
              <div className="space-y-0.5">
                <p className="text-sm">Admin</p>
                <p className="text-xs text-muted-foreground">
                  With every power comes responsibility
                </p>
              </div>
            </div>
            <Switch
              checked={user.role === "admin"}
              onCheckedChange={(e) =>
                updateUser({
                  uuid: user.uuid ?? "",
                  update: {
                    role: e.valueOf() ? "admin" : "basic",
                  },
                })
              }
            />
          </div>
          <div className="flex justify-between items-center pl-2 gap-4">
            <div className="flex gap-3 items-center">
              <SunMoon className="size-6" />
              <div className="space-y-0.5">
                <p className="text-sm">Dark mode</p>
                <p className="text-xs text-muted-foreground">
                  Swap to dark mode or light mode.
                </p>
              </div>
            </div>
            <Switch
              checked={user.theme === "dark"}
              onCheckedChange={(e) =>
                updateUser({
                  uuid: user.uuid ?? "",
                  update: { theme: e.valueOf() ? "dark" : "light" },
                })
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
