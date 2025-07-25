import React from "react";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";
import {
  FaHome,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaShippingFast,
  FaUserEdit,
  FaClock,
  FaMotorcycle,
  FaUserShield,
  FaTasks,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

function DashboardLayout() {
  const { role, isLoading } = useUserRole();
  // console.log(role);
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Page content here */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
          <div className="hidden flex-none lg:hidden">
            {/* <ul className="menu menu-horizontal">
             
              <li>
                <a>Navbar Item 1</a>
              </li>
              <li>
                <a>Navbar Item 2</a>
              </li>
            </ul> */}
          </div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <ProFastLogo></ProFastLogo>
          <li>
            <NavLink to="/">
              <FaHome className="inline mr-2" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myParcels">
              <FaBoxOpen className="inline mr-2" /> My Parcel
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymentHistory">
              <FaMoneyCheckAlt className="inline mr-2" /> Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track">
              <FaShippingFast className="inline mr-2" /> Track a Package
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile">
              <FaUserEdit className="inline mr-2" /> Update Profile
            </NavLink>
          </li>
          {/* rider links */}

          {!isLoading && role === "rider" && (
            <>
              <li>
                <NavLink to="/dashboard/pendingDeliveries">
                  <FaTasks className="inline mr-2" /> Pending Deliveries
                </NavLink>
              </li>
              {/* completed delivery */}
              <li>
                <NavLink to="/dashboard/completed-deliveries">
                  <FaCheckCircle className="inline mr-2" /> Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-earnings">
                  <FaWallet className="inline mr-2" /> My Earnings
                </NavLink>
              </li>
            </>
          )}

          {/* admin link */}
          {!isLoading && role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/pendingRiders">
                  <FaClock className="inline mr-2" /> Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/activeRiders">
                  <FaMotorcycle className="inline mr-2" /> Active Riders
                </NavLink>
              </li>
              {/* admin routes */}
              <li>
                <NavLink to="/dashboard/makeAdmin">
                  {" "}
                  <FaUserShield className="inline mr-2" />
                  Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/assignRider">
                  <FaMotorcycle className="inline mr-2" />
                  Assign Rider
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DashboardLayout;
