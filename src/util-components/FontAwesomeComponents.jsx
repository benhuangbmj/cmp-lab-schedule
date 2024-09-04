import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as fa from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";

export function ButtonPrint({ children, ...props }) {
   return (
      <Button {...props}>
         <FontAwesomeIcon icon={fa.faPrint} />
         {children}
      </Button>
   );
}
