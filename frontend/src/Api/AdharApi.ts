import { aadharApi } from "../Services/Axios";
import adhaarRouter from "../Services/Endpoint";

const parseAdhar = async (frontImage: File, backImage: File) => {
  try {
    const formData = new FormData();
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);

    const result = await aadharApi.post(adhaarRouter.parseAdhar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result.data;

  } catch (error) {
    console.error("Error in API call:", error);
    return error;
  }
};

export { parseAdhar };
