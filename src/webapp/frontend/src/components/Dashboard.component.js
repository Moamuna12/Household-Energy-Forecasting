import React, { Component } from "react";
import { Container } from "./styled.component";
import ls from "local-storage";
// fusioncharts
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";

import config from "../config";

ReactFC.fcRoot(FusionCharts, Charts);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

export default class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			totalenergy: 0,
			totalexpenditure: 0,
			consumptionArr: [],
			expenditureArr: [],
		};
	}

	fetchInfo = () => {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				let batchRowValues;
				if (data.valueRanges != null) {
					batchRowValues = data.valueRanges[0].values;
				}

				const rows = [];
				if (batchRowValues != null) {
					for (let i = 1; i < batchRowValues.length; i++) {
						let rowObject = {};
						for (let j = 0; j < batchRowValues[i].length; j++) {
							rowObject[batchRowValues[0][j]] =
								batchRowValues[i][j];
						}
						rows.push(rowObject);
					}
				}
				// console.log(rows);

				let expenditure = 0,
					consumption = 0;

				for (let i = 0; i < rows.length; i++) {
					expenditure += parseInt(rows[i].expenditure);
					consumption += parseInt(rows[i].consumption);
				}

				let consumptionArr = [];
				let expenditureArr = [];

				for (let i = 0; i < rows.length; i++) {
					expenditureArr.push({
						label: rows[i].month,
						value: rows[i].expenditure,
					});
				}

				for (let i = 0; i < rows.length; i++) {
					consumptionArr.push({
						label: rows[i].month,
						value: rows[i].consumption,
					});
				}

				this.setState({
					totalenergy: consumption,
					totalexpenditure: expenditure,
					expenditureArr: expenditureArr,
					consumptionArr: consumptionArr,
				});
			});
	};

	componentDidMount() {
		ls.set("active", 1);
		if (this.props.match.params.id) {
			if (
				ls.get("username") !== this.props.match.params.id ||
				ls.get("userType") !== this.props.match.params.type
			) {
				ls.clear();
				window.location.href = "/login";
			}
		} else {
			if (ls.get("username") !== null) {
				window.location.href =
					"/" +
					ls.get("userType") +
					"/" +
					ls.get("username") +
					"/home";
			}
		}
		this.fetchInfo();
	}

	render() {
		return (
		  <Container>
			<br></br>
			<Container className="container-fluid pr-5 pl-5 pb-5">
			  {/* Getting Started Section */}
			  <div style={{ marginBottom: "50px" }}>
				<h1 className="display-4" align="center" style={{ marginTop: '50px', marginBottom: '50px', fontFamily: '-moz-initial' }}>
				  Welcome to your Household Energy Predictor App!
				</h1>
				<h4 align="center" style={{ marginTop: '50px', marginBottom: '50px', fontFamily: '-moz-initial' }}>
				  Thank you for choosing our app to predict household energy consumption. Here's a quick guide to get started:
				</h4>
				<div className="row">
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Prediction</h5>
						<p className="card-text">
						  Make energy predictions by entering start and end dates. Download predictions as CSV.
						</p>
					  </div>
					</div>
				  </div>
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Graphs</h5>
						<p className="card-text">
						  Visualize predictions in graphs from the "Graphs" section.
						</p>
					  </div>
					</div>
				  </div>
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Weather</h5>
						<p className="card-text">
						  Check the weather for the next 5 days in the "Weather" section.
						</p>
					  </div>
					</div>
				  </div>
				</div>
				<div className="row">
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Profile</h5>
						<p className="card-text">
						  View and update your profile information in the "Profile" section.
						</p>
					  </div>
					</div>
				  </div>
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Users</h5>
						<p className="card-text">
						  Explore registered users in the "Users" section.
						</p>
					  </div>
					</div>
				  </div>
				  <div className="col-md-4">
					<div className="card mb-4 shadow-sm">
					  <div className="card-body">
						<h5 className="card-title">Register</h5>
						<p className="card-text">
						  Create a new account in the "Register" section.
						</p>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</Container>
		  </Container>
		);
	}
}
