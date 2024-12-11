import { axiosInstance } from "../../../api/common";
import { useState, useEffect } from "react";
import { apiUrl } from "../../../api/common";

function AdminprovidersPage() {
  const [providers, setProviders] = useState<Array<any>>([]);
  useEffect(() => {
    axiosInstance
      .get(apiUrl + "/api/admin/providers/getproviders")
      .then((response) => {
        setProviders(response.data.providers);
      });
  }, []);
  const ProviderBlockOrUnblock = (id: string, state: boolean) => {
    axiosInstance
      .patch(apiUrl + "/api/admin/providers/blockorunblock", { id, state })
      .then((response) => {
        if (response.data.success) {
          const updatedData = providers.map((provider) => {
            if (provider._id === id) {
              return { ...provider, blocked: state };
            }
            return provider;
          });
          setProviders(updatedData);
        }
      });
  };

  return (
    <div className="w-full h-[1050px] flex flex-col mt-20 items-center scrollbar-hide overflow-y-scroll bg-black">
      <div className="w-[90%] ">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-white">Workshop Name</th>
              <th className="px-4 py-2 text-left text-white">Owner Name</th>
              <th className="px-4 py-2 text-left text-white">Email</th>
              <th className="px-4 py-2 text-left text-white">Mobile</th>
              <th className="px-4 py-2 text-left text-white">
                Workshop Details
              </th>
              <th className="px-4 py-2 text-left text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <tr
                  key={provider._id}
                  className="border-b-2 border-b-gray-500 animate-fadeInUp hover:bg-banner-gray"
                >
                  <td className="px-4 py-2 text-white">
                    {provider.workshopName}
                  </td>
                  <td className="px-4 py-2 text-white">{provider.ownerName}</td>
                  <td className="px-4 py-2 text-white">{provider.email}</td>

                  <td className="px-4 py-2 text-white">{provider.mobile}</td>
                  <td className="px-4 py-2 text-white">
                    {provider.workshopDetails.address}
                  </td>

                  <td className="px-4 py-2 text-white space-y-5">
                    <button
                      className={`${provider.blocked && "bg-blue-500"} ${
                        !provider.blocked && "bg-red"
                      } text-white text-sm px-3 py-1 rounded  mr-2 font-semibold`}
                      onClick={() => {
                        if (provider.blocked) {
                          ProviderBlockOrUnblock(provider._id, false);
                        }
                        if (!provider.blocked) {
                          ProviderBlockOrUnblock(provider._id, true);
                        }
                      }}
                    >
                      {provider.blocked ? "UNBLOCK" : "BLOCK"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <p className="text-center text-white text-md font-semibold">
                No Users
              </p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminprovidersPage;
