export const handleNotFound = async (router, e, type) => {
  const status = e?.response?.status;

  if (status === 404 || status === 410) {
    await router.replace({
      name: "NotFound",
      query: type ? { type } : {},
    });
    return true;
  }

  return false;
};
