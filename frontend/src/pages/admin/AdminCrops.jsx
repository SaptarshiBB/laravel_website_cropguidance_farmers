import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";
import SelectInput from "../../components/ui/SelectInput";
import { createCrop, deleteCrop, updateCrop } from "../../api/adminApi";
import { getCrops } from "../../api/cropApi";
import { seasons } from "../../utils/constants";
import { toArray } from "../../utils/helpers";

const blank = {
  name: "",
  season: "kharif",
  soil_types: "Loamy",
  min_temp: 10,
  max_temp: 35,
  min_rainfall: 300,
  max_rainfall: 1000,
  fertilizer_recommendation: "Balanced NPK and compost.",
  yield_per_acre: "10-20 quintals",
  description: "Suitable crop for Indian farming conditions.",
  image_url: "https://source.unsplash.com/featured/?crop",
};
export default function AdminCrops() {
  const [crops, setCrops] = useState([]),
    [edit, setEdit] = useState(null);
  useEffect(() => {
    getCrops()
      .then(setCrops)
      .catch(() => setCrops([]));
  }, []);
  const save = async () => {
    const payload = {
      ...edit,
      season: edit.season.toLowerCase(),
      soil_types: toArray(edit.soil_types),
    };
    const res = edit.id ? await updateCrop(edit.id, payload) : await createCrop(payload);
    setCrops(edit.id ? crops.map((c) => (c.id === res.id ? res : c)) : [res, ...crops]);
    setEdit(null);
    toast.success("Crop saved");
  };
  const remove = async (c) => {
    await deleteCrop(c.id);
    setCrops(crops.filter((x) => x.id !== c.id));
    toast.success("Crop deleted");
  };
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Crops Management</h1>
          <Button onClick={() => setEdit(blank)}>Add Crop</Button>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "season", label: "Season" },
            { key: "yield_per_acre", label: "Yield" },
          ]}
          data={crops}
          actions={(c) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setEdit({ ...c, soil_types: (c.soil_types || []).join(", ") })}
              >
                Edit
              </Button>
              <Button variant="danger" onClick={() => remove(c)}>
                Delete
              </Button>
            </div>
          )}
        />
        <Modal
          open={!!edit}
          title="Crop Form"
          onClose={() => setEdit(null)}
          footer={<Button onClick={save}>Save</Button>}
        >
          {edit && (
            <div className="grid gap-3 md:grid-cols-2">
              <FormInput
                label="Name"
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              />
              <SelectInput
                label="Season"
                options={seasons.map((s) => s.toLowerCase())}
                value={edit.season}
                onChange={(e) => setEdit({ ...edit, season: e.target.value })}
              />
              <FormInput
                label="Soil types"
                value={edit.soil_types}
                onChange={(e) => setEdit({ ...edit, soil_types: e.target.value })}
              />
              <FormInput
                label="Yield"
                value={edit.yield_per_acre}
                onChange={(e) => setEdit({ ...edit, yield_per_acre: e.target.value })}
              />
              <FormInput
                label="Min temp"
                type="number"
                value={edit.min_temp}
                onChange={(e) => setEdit({ ...edit, min_temp: e.target.value })}
              />
              <FormInput
                label="Max temp"
                type="number"
                value={edit.max_temp}
                onChange={(e) => setEdit({ ...edit, max_temp: e.target.value })}
              />
              <FormInput
                label="Min rainfall"
                type="number"
                value={edit.min_rainfall}
                onChange={(e) => setEdit({ ...edit, min_rainfall: e.target.value })}
              />
              <FormInput
                label="Max rainfall"
                type="number"
                value={edit.max_rainfall}
                onChange={(e) => setEdit({ ...edit, max_rainfall: e.target.value })}
              />
              <FormInput
                label="Image URL"
                value={edit.image_url}
                onChange={(e) => setEdit({ ...edit, image_url: e.target.value })}
              />
              <FormInput
                label="Fertilizer"
                value={edit.fertilizer_recommendation}
                onChange={(e) => setEdit({ ...edit, fertilizer_recommendation: e.target.value })}
              />
              <textarea
                className="md:col-span-2 rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900"
                value={edit.description}
                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
              />
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
