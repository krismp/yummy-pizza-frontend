import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function(props) {
  return (
    <Snackbar open={props.isOpen} autoHideDuration={props.autoHideDuration} onClose={props.onClose}>
      <Alert severity={props.severity} onClose={props.onClose}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
