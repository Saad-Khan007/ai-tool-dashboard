/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import FilterListIcon from "@mui/icons-material/FilterList";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import { func } from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment-timezone";
import PropTypes from "prop-types";

function Projects(props) {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [menu, setMenu] = useState(null);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (props.isAll) {
      setTitle("Circut stats");
      setColumns([
        { Header: "Users", accessor: "email", width: "30%", align: "left" },
        { Header: "Ingredients", accessor: "ingredients", width: "20%", align: "left" },
        { Header: "created", accessor: "timestamp", width: "20%", align: "left" },
      ]);
      findAll();
    } else if (props.isEmail) {
      setColumns([
        { Header: "Users", accessor: "user", width: "25%", align: "left" },
        { Header: "Created", accessor: "created", width: "35%", align: "left" },
      ]);
      setTitle("Users");
      findEmailList();
    }
  }, []);
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setSelectedFilter(filterValue);
    setLoading(true);

    if (filterValue !== "Custom") {
      findAll(filterValue);
    }
  };
  useEffect(() => {
    if (props.isAll) {
      findAll(selectedFilter);
    }
  }, [selectedFilter]);

  const findAll = (filter) => {
    let start, end;
    const today = moment().startOf("day").format("YYYY-MM-DD");
    const startOfThisWeek = moment().startOf("week").format("YYYY-MM-DD");
    const startOfLastWeek = moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD");
    const startOfThisMonth = moment().startOf("month").format("YYYY-MM-DD");
    const startOfLastMonth = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD");

    switch (filter) {
      case "Today":
        start = today;
        end = moment().endOf("day").format("YYYY-MM-DD");
        break;

      case "Yesterday":
        start = moment().subtract(1, "day").startOf("day");
        end = moment().subtract(1, "day").endOf("day");

        break;

      case "This Week":
        start = startOfThisWeek;
        end = moment().endOf("day");
        break;

      case "Last Week":
        start = startOfLastWeek;
        end = moment().subtract(1, "week").endOf("week");
        break;

      case "This Month":
        start = startOfThisMonth;
        end = moment().endOf("day");
        break;

      case "Last Month":
        start = startOfLastMonth;
        end = moment().subtract(1, "month").endOf("month");
        break;
      default:
        break;
    }
    axios
      .post(
        "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-pezxd/endpoint/listall",
        {
          startDate: moment(start).format("YYYY-MM-DD"),
          endDate: moment(end).format("YYYY-MM-DD"),
        },
        {
          "Content-Type": "application/json",
        }
      )

      .then(function (response) {
        displayData(response.data);
      })
      .catch(function (error) {})
      .finally(() => setLoading(false));
  };
  function findEmailList() {
    axios
      .get("https://ap-southeast-1.aws.data.mongodb-api.com/app/data-pezxd/endpoint/listemails")
      .then(function (response) {
        displayData(response.data);
      });
  }

  function displayData(result) {
    setLoading(false);
    const data = [];
    result.forEach((item, i) => {
      if (props.isAll) {
        if (item.timestamp) {
          item.timestamp = formatFrontendTimestamp(item.timestamp);
        }
        data.push(item);
      } else if (props.isEmail) {
        if (item.timestamp) {
          item.timestamp = formatFrontendTimestamp(item.timestamp);
        }
        data.push({ user: item.user, created: item.timestamp });
      }
    });
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setRows(data);
  }
  function formatFrontendTimestamp(timestampString) {
    const date = new Date(timestampString);
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "UTC", // Ensure 'UTC' time zone
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  }
  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
        </MDBox>
      </MDBox>

      {props.isAll ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl
              style={{ width: "250px", padding: "8px", height: "60px" }}
              id="filter-change"
            >
              <Select
                value={selectedFilter}
                onChange={handleFilterChange}
                displayEmpty
                style={{ width: "100%", height: "100%" }}
              >
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="Last Week">Last Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
              </Select>
            </FormControl>
            {loading && <CircularProgress size={28} color="success" />}
          </div>
          {selectedFilter === "Custom" && (
            <Box sx={{ display: "flex", alignItems: "center" }}></Box>
          )}
        </Box>
      ) : null}

      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={true}
          isSorted={true}
          entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
        />
      </MDBox>
    </Card>
  );
}
Projects.propTypes = {
  isAll: PropTypes.bool.isRequired,
  isEmail: PropTypes.bool.isRequired,
};
export default Projects;
