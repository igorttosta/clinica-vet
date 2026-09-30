export type PetSex = "MACHO" | "FEMEA" | "NAO_INFORMADO";

export interface Pet {
  id: string;
  clientId: string;
  petNumber: number;
  publicCode: string; // CPF do tutor + "-" + número do pet
  name: string;
  speciesId: string;
  breedId: string | null;
  sex: PetSex;
  birthDate: string | null;
  approximateBirthDate: boolean;
  color: string | null;
  neutered: boolean | null;
  microchip: string | null;
  photoUrl: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
