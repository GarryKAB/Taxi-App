import React, { Component } from "react";
import { Text } from "react-native";
import { View, List, ListItem, InputGroup, Input, Left, Body } from "native-base";

import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './SearchResultsStyles.js';

export const SearchResults = ({predictions}) => {
    return (
        <View style={styles.searchResultsWrapper}>
            <List
                dataArray={predictions}
                renderRow={(item) =>
                    <View>
                        <ListItem button avatar>
                            <Left style={styles.leftContainer}>
                                <Icon style={styles.leftIcon} name="location-on" />
                            </Left>
                            <Body>
                                <Text style={styles.primaryText}>{item.primaryText}</Text>
                                <Text style={styles.secondaryText}>{item.primaryText}</Text>
                            </Body>
                        </ListItem>
                    </View>
                }
            />
        </View>
    );
}

export default SearchResults;

