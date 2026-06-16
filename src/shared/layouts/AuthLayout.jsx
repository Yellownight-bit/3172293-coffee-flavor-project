import { Outlet } from "react-router-dom";
import authBg from "@/assets/images/bg-1.png";
import { UserRegisterForm2 } from "../../features/users";

export default function DashboardLayout() {
  return (
    <>
      <div className="min-h-screen grid grid-cols-2">

        <div>
          <img
            src= {authBg}
            alt="Restaurante"
            className="w-full h-screen object-cover"
          />
        </div>

        <div className="bg-orange-50 flex justify-center items-center">
          <main>

            <UserRegisterForm2 />

            <Outlet />

          </main>
        </div>

      </div>
    </>
  );
}