import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import React from "react";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { BarChart } from "@mui/x-charts/BarChart";
import MDTypography from "components/MDTypography";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import { Typography } from "@mui/material/Typography";

function Dashboard() {
  const [openUserDialog, setOpenUserDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const { sales, tasks } = reportsLineChartData;
  const [emails, setEmailCount] = useState(0);
  const [keywords, setKeywordsCount] = useState(0);
  const [userEmail, setuserEmail] = useState();
  const [ingred, setingCount] = useState(0);
  const [total, setTotalCount] = useState(0);
  const [mostsearchedingredients, setMostsearched] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  useEffect(() => {
    findAll();
  }, []);

  const handleUserDialogOpen = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleUserDialogClose = () => {
    setSelectedUser(null);
    setOpenUserDialog(false);
  };

  function findAll() {
    axios
      .get("https://ap-southeast-1.aws.data.mongodb-api.com/app/data-pezxd/endpoint/stats")
      .then(function (response) {
        if (response.data) {
          setEmailCount(response.data.users.length);
          setKeywordsCount(response.data.keywords.length);
          setingCount(response.data.ingredients.length);
          setTotalCount(response.data.total.length);
          setMostsearched(response.data.mostSearchedIngredients);
          setuserEmail(response.data.users);
        }
      });
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3.6} onClick={() => setShowUserList(true)}>
            <div>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard icon="leaderboard" title=" Users" count={emails} />
              </MDBox>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={3.6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Ingredients"
                count={ingred}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3.6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Most Searched Ingredient"
                count={mostsearchedingredients}
                countStyle={{ fontSize: "14px" }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Projects isAll={true} />
            </Grid>
          </Grid>
          {showUserList && (
            <MDBox>
              <Dialog id="user-list" onClose={() => setShowUserList(false)} open={showUserList}>
                <DialogTitle>User List</DialogTitle>
                <List sx={{ pt: 0 }}>
                  {userEmail?.map((email, index) => (
                    <ListItem disableGutters key={index}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={email} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Dialog>
            </MDBox>
          )}
        </MDBox>
        <MDBox>
          <Grid container spacing={3} justifyContent="flex-end" style={{ paddingTop: "40px" }}>
            <Grid>
              <Grid item xs={12}>
                <MDTypography variant="h6" style={{ padding: "30px" }}>
                  Circut Analytics
                </MDTypography>
              </Grid>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Today", "This Week", "Last Week", "This Month"],
                  },
                ]}
                series={[{ data: [5, 16, 23, 42] }]}
                width={580}
                height={500}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <Projects isEmail={true} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Dashboard;
