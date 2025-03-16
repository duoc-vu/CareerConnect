import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  style,
  buttonStyle,
  textStyle,
}) => {
  const getPaginationRange = () => {
    const range = [];
    let start = currentPage - 2;
    let end = currentPage + 2;

    if (start < 1) {
      start = 1;
      end = 5;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - 4 > 0 ? totalPages - 4 : 1;
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const range = getPaginationRange();

  return (
    <View style={[styles.paginationContainer, style]}>
      <TouchableOpacity
        onPress={() => handlePageChange(currentPage - 1)}
        style={[styles.pageButton, styles.arrowButton, buttonStyle]}>
        <Text style={[styles.pageText, textStyle]}>{"<"}</Text>
      </TouchableOpacity>

      {range.map((pageNumber) => (
        <TouchableOpacity
          key={pageNumber}
          onPress={() => handlePageChange(pageNumber)}
          style={[
            styles.pageButton,
            pageNumber === currentPage && styles.activePageButton,
            buttonStyle,
          ]}>
          <Text
            style={[
              styles.pageText,
              pageNumber === currentPage && styles.activePageText,
              textStyle,
            ]}>
            {pageNumber}
          </Text>
        </TouchableOpacity>
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <Text style={[styles.pageText, textStyle]}>...</Text>
      )}

      <TouchableOpacity
        onPress={() => handlePageChange(currentPage + 1)}
        style={[styles.pageButton, styles.arrowButton, buttonStyle]}>
        <Text style={[styles.pageText, textStyle]}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  pageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: '#6A5ACD',
    borderColor: '#6A5ACD',
  },
  pageText: {
    color: '#333',
    fontSize: 16,
  },
  activePageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 12,
  },
});

export default Pagination;
