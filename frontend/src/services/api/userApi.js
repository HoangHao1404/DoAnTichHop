import axiosClient from "./axiosClient";

const userApi = {
	updateProfile(payload) {
		return axiosClient.put("/users/profile", payload);
	},

	changePassword(oldPassword, newPassword) {
		return axiosClient.put("/users/change-password", {
			oldPassword,
			newPassword,
		});
	},
};

export default userApi;
