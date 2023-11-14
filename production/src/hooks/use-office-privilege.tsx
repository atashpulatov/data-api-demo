import { useEffect, useState } from 'react';
import { sessionHelper } from '../storage/session-helper';

const useOfficePrivilege = (authToken: string): boolean => {
  const [canUseOffice, setCanUseOffice] = useState(false);

  useEffect(() => {
    async function checkCanUseOffice() {
      const isUseOfficePrivilege = await sessionHelper.getCanUseOfficePrivilege();
      setCanUseOffice(isUseOfficePrivilege);
    }

    checkCanUseOffice();
  }, [authToken]);

  return canUseOffice;
};

export default useOfficePrivilege;
