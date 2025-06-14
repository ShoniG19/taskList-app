import { Popover } from '@headlessui/react';

import { useTranslation } from 'react-i18next';

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const OptionsPopover = () => {

  const { t } = useTranslation();

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <Popover className="relative">
      <Popover.Button className="text-slate-600 hover:text-slate-900 focus:outline-none">
        <MoreHorizOutlinedIcon className="cursor-pointer" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1 text-sm text-slate-700">
          <button
            className="block w-full px-4 py-2 hover:bg-emerald-200 text-left"
            onClick={() => window.location.href = '/profile'}
          >
            {t("profile_settings")}
          </button>
          <button
            className="block w-full px-4 py-2 text-red-600 hover:bg-red-50 text-left"
            onClick={() => logout()}
          >
            {t("sign_out")}
          </button>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default OptionsPopover;
