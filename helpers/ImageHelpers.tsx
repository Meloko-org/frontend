import * as FileSystem from "expo-file-system";

export default async function saveImageLocally(
  uri: string,
  path: string,
): Promise<string | null> {
  try {
    const directory = FileSystem.documentDirectory + path;

    // Crée le dossier s'il n'existe pas
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    // Génère un nouveau nom de fichier
    const extension = uri.split(".").pop();
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension || "jpg"}`;
    const newPath = directory + filename;

    // Copie le fichier dans ce dossier
    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    return newPath;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l’image :", error);
    return null;
  }
}
