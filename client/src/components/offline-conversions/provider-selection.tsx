import { SiGoogle, SiMeta, SiTiktok, SiApple } from "react-icons/si";
import { Provider } from "./mock-setup";

interface ProviderConfig {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    textColor?: string;
    customIcon?: React.ReactNode;
}

export interface ProviderOptions {
    key: Provider;
    enabled?: boolean;
}

const providerConfigs: Record<Provider, ProviderConfig> = {
    [Provider.Google]: {
        label: "Google",
        icon: SiGoogle,
        bgColor: "bg-[#EA4335]",
        textColor: "text-white",
    },
    [Provider.Meta]: {
        label: "Meta",
        icon: SiMeta,
        bgColor: "bg-[#1877F2]",
        textColor: "text-white",
    },
    [Provider.TikTok]: {
        label: "TikTok",
        icon: SiTiktok,
        bgColor: "bg-black",
        textColor: "text-white",
    },
    [Provider.Apple]: {
        label: "Apple",
        icon: SiApple,
        bgColor: "bg-black",
        textColor: "text-white",
    },
    [Provider.Yandex]: {
        label: "Yandex",
        icon: SiGoogle, // We'll use a custom icon for this
        bgColor: "bg-red-600",
        textColor: "text-white",
        customIcon: <span className="text-[10px] text-white font-bold">Y</span>,
    },
};

interface ProviderSelectionProps {
    providers: ProviderOptions[];
    selectedProvider: Provider;
    onProviderChange: (provider: Provider) => void;
    attrIdPrefix?: string;
    containerFit?: "fit" | "full";
}

export default function ProviderSelection({
    providers,
    selectedProvider,
    onProviderChange,
    attrIdPrefix = "tab",
    containerFit = "fit",
}: ProviderSelectionProps) {
    return (
        <div
            className={`flex items-center dark:bg-gray-800 p-1 rounded-lg border shadow-inner w-${containerFit} bg-[#ffffff]`}
        >
            {providers.map(({ key: provider, enabled = false }) => {
                const config = providerConfigs[provider];
                const Icon = config.icon;
                const isSelected = selectedProvider === provider;
                const isDisabled = !enabled;
                // const isDisabled = false;

                const disabledClass = isDisabled
                    ? "opacity-90 bg-gray-10 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    : "";
                const selectedClass = isSelected
                    ? "bg-white dark:bg-gray-700 text-foreground shadow-md border border-gray-200 dark:border-gray-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50";

                return (
                    <button
                        type="button"
                        key={provider}
                        onClick={() => onProviderChange(provider)}
                        // disabled={isDisabled}
                        className={`flex items-center gap-1.5 px-2 2xl:px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 flex-1 justify-center ${disabledClass} ${selectedClass}`}
                        data-testid={`${attrIdPrefix}-${provider.toLowerCase()}`}
                    >
                        <div
                            className={`w-3.5 h-3.5 ${isDisabled ? "bg-gray-300 dark:bg-gray-600" : config.bgColor} rounded flex items-center justify-center`}
                        >
                            {config.customIcon ? (
                                <span
                                    className={`text-[10px] font-bold ${isDisabled ? "text-gray-500 dark:text-gray-400" : config.textColor}`}
                                >
                                    Y
                                </span>
                            ) : (
                                <Icon
                                    className={`w-2.5 h-2.5 ${isDisabled ? "text-gray-500 dark:text-gray-400" : config.textColor}`}
                                />
                            )}
                        </div>
                        <span className="hidden 2xl:inline">{config.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
