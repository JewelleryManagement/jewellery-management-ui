import axios from "@/axios.config";

// GET REQUESTS
async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to fetch data from the server.");
  }
}

export async function fetchResources() {
  return await fetchData("/resources");
}

export async function fetchResourcePerUser(userId) {
  return await fetchData(`/resources/availability/${userId}`);
}

export async function fetchProducts() {
  return await fetchData("/products");
}

export async function fetchUsers() {
  return await fetchData("/users");
}

// POSTS REQUESTS
async function postData(endpoint, data) {
  try {
    const response = await axios.post(endpoint, data);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to post data to the server.");
  }
}

export async function postResources(data) {
  return await postData("/resources", data);
}

export async function postResourceAvailability(data) {
  return await postData("/resources/availability", data);
}

// DELETE REQUESTS

async function removeData(endpoint) {
  try {
    await axios.delete(endpoint);
  } catch (error) {
    throw new Error("Failed to delete this resource.");
  }
}

export async function removeResource(id) {
  return await removeData(`/resources/${id}`);
}

export async function removeResourceQuantity(userId, resourceId, quantity) {
  return await removeData(
    `/resource/availability/${userId}/${resourceId}/${quantity}`
  );
}

// PUT REQUEST

async function updateData(endpoint, data) {
  try {
    const response = await axios.put(endpoint, data);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to update data on the server.");
  }
}

export async function updateResource(id, data) {
  return await updateData(`/resources/${id}`, data);
}
