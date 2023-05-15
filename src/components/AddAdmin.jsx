import { toast } from "react-hot-toast";
import { functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";

export default function AddAdmin() {
  const addAdmin = httpsCallable(functions, "addAdmin");

  const handleClick = () => {
    addAdmin({ "email":'laithalwani@gmail.com' })
      .then((result) => {
        toast.success(result.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return <button onClick={handleClick}>AddAdmin</button>;
}
