import { useContext } from "react";
import StudentContext from "../context/StudentProvider";

const useStudent = () => {
  return useContext(StudentContext);
};

export default useStudent;
