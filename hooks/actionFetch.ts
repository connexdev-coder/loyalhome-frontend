export async function useActionGet(path: string) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const response: Response = await $fetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  return response;
}

export async function useActionPost(path: string, body: any) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const response: Response = await $fetch(
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

  return response;
}

export async function useActionPut(path: string, body: any) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const response: Response = await $fetch(
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

  return response;
}

export async function useActionDelete(path: string) {
  const runtimeConfig = useRuntimeConfig();
  const token = useCookie("token");

  const response: Response = await $fetch(
    `${runtimeConfig.public.api_url + path}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}

export const useActionPostFormData = async (
  endpoint: string,
  formData: FormData
) => {
  const config = useRuntimeConfig();
  try {
    return await $fetch(`${config.public.apiBase}/${endpoint}`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header, let the browser set it with the boundary
    });
  } catch (error: any) {
    return error.response;
  }
};
