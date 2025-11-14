import { UserData, AddressData, UserAddressData } from "../types/API";

const getStripeCustomerData = (
  user: UserData,
  billingAddress: UserAddressData,
) => ({
  name: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim(),
  email: user.email,
  address: billingAddress
    ? {
        line1: billingAddress.address.address1 ?? "",
        line2: billingAddress.address.address2 ?? "",
        postal_code: billingAddress.address.postalCode ?? "",
        city: billingAddress.address.city ?? "",
        country: billingAddress.address.country ?? "",
      }
    : undefined,
});

export default {
  getStripeCustomerData,
};
