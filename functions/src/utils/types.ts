import type { 
    APIApplicationCommand,
    APIInteractionResponseCallbackData,
    APIChatInputApplicationCommandInteraction,
    APIChatInputApplicationCommandInteractionData,
    APIApplicationCommandInteractionDataBasicOption
} from "discord-api-types/v10";
import type { Firestore } from "firebase-admin/firestore";


type PartialAPIApplicationCommand = Omit<
    APIApplicationCommand, 
    "id" | "application_id"| "version" | "default_member_permissions" | "type"
>;

type PartialAPIApplicationCommandInteractionData = Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
    options?: APIApplicationCommandInteractionDataBasicOption[];
};

type PartialAPIChatInputApplicationCommandInteraction = Omit<APIChatInputApplicationCommandInteraction, "data"> & {
    data: PartialAPIApplicationCommandInteractionData;
};



export type AppCommand = PartialAPIApplicationCommand & {
    callback: ({
            interaction,db
        }:{
            interaction: PartialAPIChatInputApplicationCommandInteraction,
            db: Firestore
        }
    ) => Promise<APIInteractionResponseCallbackData|void>
};
