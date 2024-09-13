import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Schedule from "/src/Schedule";
import Profile from "/src/profile/Profile";
import FrontendLab from "/src/FrontendLab";
import LogIn from "/src/auth/LogIn";
import ProtectedRoute from "/src/util-components/ProtectedRoute";
import Admin from "/src/admin/Admin";
import Progress from "/src/progress/Progress";
import Dashboard from "/src/dashboard/Dashboard";
import CheckInWithID from "/src/checkInWithID/CheckInWithID";
import CheckInWithFace from "/src/checkInWithFace/CheckInWithFace";
import Reroute from "/src/routes/components/Reroute";
import Banner from "/src/util-components/Banner";
import { AppContext } from "/src/contexts/AppContext";

export default function () {
	const userData = useSelector((state) => state.userData.items);
	const activeUser = useSelector((state) => state.active.user);
	const { basePath } = React.useContext(AppContext);
	return (
		<Routes>
			<Route path={basePath} element={<Outlet />}>
				<Route
					path=""
					element={
						basePath == "/dept/demo" ||
						userData?.[activeUser]?.roles?.admin == true ? (
							<Schedule />
						) : (
							<Banner text={import.meta.env.VITE_SITE_NOTICE} />
						)
					}
				/>
				<Route
					path="profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="progress"
					element={
						<ProtectedRoute>
							<Progress />
						</ProtectedRoute>
					}
				/>
				<Route
					path="admin"
					element={
						<ProtectedRoute role="admin">
							<Admin />
						</ProtectedRoute>
					}
				/>
				<Route
					path="experimental"
					element={
						<ProtectedRoute role="developer">
							<FrontendLab />
						</ProtectedRoute>
					}
				/>
				<Route path="login" element={<LogIn />} />
				<Route path="checkinwithid" element={<CheckInWithID />} />
				<Route path="checkinwithface" element={<CheckInWithFace />} />
				<Route
					path="dashboard"
					element={
						<ProtectedRoute role="admin">
							<Dashboard />
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route
				path="*"
				element={<Banner text={import.meta.env.VITE_SITE_NOTICE} />}
			/>
		</Routes>
	);
}
