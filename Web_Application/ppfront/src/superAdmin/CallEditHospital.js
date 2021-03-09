import React from "react";
import { useParams } from "react-router-dom";

import EditHospital from "./EditHospital";

function CallEditHospital() {
  const { id } = useParams();
  console.log(id);

  return (
    <div>
      <EditHospital id={id} />
    </div>
  );
}

export default CallEditHospital;
