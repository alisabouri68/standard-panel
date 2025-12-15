import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faHome,
  faLocationCrosshairs,
  faPhoneVolume,
  faPodcast,
} from "@fortawesome/free-solid-svg-icons";

import logoDash from "Asset/images/logo-dash.png";

function Sidebar() {
  return (
    <div className="truncate">
      <div className="flex flex-col items-center py-6">
        <img src={logoDash} />
        <span className="font-bold text-sm mt-3">RAAD HL</span>
        <div className=" w-11/12 h-0.5 bg-gray-200 rounded-full mt-2"></div>
      </div>
      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon className="w-8 h-8 text-gray-400" icon={faHome} />
          <span className="text-sm mt-3 text-gray-400 font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            className="w-8 h-8 text-gray-400"
            icon={faPhoneVolume}
          />
          <span className="text-sm mt-3 font-bold">Comm</span>
        </div>
        <div className="flex items-center">
          <div className="w-0.5 h-14 bg-blue-400 relative right-5 shadow-blue-400 shadow-2xl" />
          <div className="flex flex-col items-center">
            <FontAwesomeIcon
              className="w-8 h-8 text-blue-400"
              icon={faBriefcase}
            />
            <span className="text-sm mt-3 text-blue-400 font-bold">Desk</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon className="w-8 h-8 text-gray-400" icon={faPodcast} />
          <span className="text-sm mt-3 font-bold">Cast</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            className="w-8 h-8 text-gray-400"
            icon={faLocationCrosshairs}
          />
          <span className="text-sm mt-3 font-bold">Hot</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
