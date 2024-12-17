export async function useGet(path: string) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const { data, error, status, refresh } = await useFetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  return { data, error, status, refresh };
}

export async function usePost(path: string, body: any) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const { data, error, status } = await useFetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    }
  );

  return { data, error, status };
}

export async function usePut(path: string, body: any) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const { data, error, status } = await useFetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    }
  );

  return { data, error, status };
}

export async function useDelete(path: string) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const { data, error, status } = await useFetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    }
  );

  return { data, error, status };
}

export async function useUpload(path: string, file: File) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const formData = new FormData();
  formData.append("image", file);

  const { data, error, status } = await useFetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    }
  );

  return { data, error, status };
}
