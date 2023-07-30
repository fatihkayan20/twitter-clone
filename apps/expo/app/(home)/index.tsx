import * as React from "react";

import { useProtect } from "@/hooks/comon/useProtect";
import { TabView } from "react-native-tab-view";
import { TweetList } from "@/components/views/home/TweetList";
import { ITab } from "@/types/ITab";
import { trpc } from "@/utils/trpc";
import { Pressable, Text, View } from "react-native";

export default function Page() {
  useProtect();

  const utils = trpc.useContext();

  const [navigationState, setNavigationState] = React.useState({
    index: 0,
    routes: [
      { key: ITab.ForYou, title: "For you" },
      { key: ITab.Following, title: "Following" },
    ],
  });

  const handleIndexChange = (index: number) => {
    setNavigationState((prev) => ({ ...prev, index }));
    utils.tweet.all.invalidate();
  };

  const renderTabBar = React.useCallback(
    (props: {
      navigationState: {
        routes: {
          title: string;
          key: string;
        }[];
        index: number;
      };
    }) => {
      return (
        <View className="flex-row">
          {props.navigationState.routes.map((route, i) => {
            const focused = props.navigationState.index === i;

            return (
              <Pressable
                key={i}
                className="flex-1 items-center p-4"
                onPress={() => handleIndexChange(i)}
              >
                <View
                  className={`${
                    focused ? "border-b border-black " : ""
                  } py-2 px-4`}
                >
                  <Text
                    className={`${focused ? " text-black" : "text-black/50"}`}
                  >
                    {route.title}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      );
    },
    [],
  );

  return (
    <TabView
      navigationState={navigationState}
      renderScene={({ route }) => {
        return <TweetList tab={route.key} />;
      }}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: 100 }}
      renderTabBar={renderTabBar}
    />
  );
}
