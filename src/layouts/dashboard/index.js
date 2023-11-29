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

// @mui material components
import Grid from "@mui/material/Grid";

import { useState, useEffect } from "react";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import axios from "axios";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [emails, setEmailCount] = useState(0);
  const [keywords, setKeywordsCount] = useState(0);
  const [ingred, setingCount] = useState(0);
  const [total, setTotalCount] = useState(0);
  const [mostsearchedingredients, setMostsearched] = useState(0);

  useEffect(() => {
    findAll();
  }, []);

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
        }
      });
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3.6}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="leaderboard" title=" Users" count={emails} />
            </MDBox>
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
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects isTodaysdata={true} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Projects isIngredients={true} />
            </Grid>
          </Grid>
        </MDBox> */}
        <MDBox mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Projects isAll={true} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
