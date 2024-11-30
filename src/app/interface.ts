export interface IAddress {
  id: string,
  fullAddress: string,
  streetAddress: string,
  city: string,
  postalCode: string,
  state: string,
  country: string
}

export interface IVehicle {
  id: string,
  numberPlate: string,
  model: string,
  color: string
}

export interface IProperty {
  id: string,
  name: string,
  address: IAddress,
  authorizedVehicles: IVehicle[],
  isActive: boolean
}

export interface ILogin {
  username: string,
  password: string,
}

export interface IUser {
  username: string,
  firstName: string,
  lastName: string,
  email: string
}

export interface ICatch {
  id: string,
  vehicle: IVehicle,
  property: IProperty,
  user: IUser,
  timestamp: string,
  releaseInfo: IRelease
}

export interface IRelease {
  id: string,
  vehicle: IVehicle,
  property: IProperty,
  user: IUser,
  timestamp: string,
}
export interface IReportEntry {
  catchInfo: ICatch | null;
  releaseInfo: IRelease | null;
  type: 'full' | 'half';
  vehicle: IVehicle;
  property: IProperty;
}
export interface ICompanyReportEntry {
  catchInfo: ICatch;
  releaseInfo: IRelease;
}

export interface IRegister {
  username: string,
  password: string,
}
