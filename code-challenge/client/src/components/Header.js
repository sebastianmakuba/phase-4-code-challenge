import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Super Heroes
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
