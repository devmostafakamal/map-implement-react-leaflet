import React from "react";
import { Link } from "react-router";

function ProFastLogo() {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img className="mb-2" src="/assets/logo.png" alt="" />
        <p className="text-3xl -ml-2 font-extrabold ">ProFast</p>
      </div>
    </Link>
  );
}

export default ProFastLogo;
