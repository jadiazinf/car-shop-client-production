import UserModel from "./model";
import { Gender } from "./types";

class UserHelper {
  constructor(
    private readonly _user: UserModel
  ) {}

  translateUserGender() {
    switch(this._user.gender) {
      case Gender.FEMALE:
        return 'Mujer';
      case Gender.MALE:
        return 'Hombre';
    }
  }
}

export default UserHelper;
