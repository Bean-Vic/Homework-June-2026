# 作业提交规范说明

每次作业提交请通过 **Pull Request (PR)** 完成，并遵循以下规则：

## 目录结构

- 所有作业必须放在对应的 **HW 文件夹** 下。
- 在 **HW 文件夹** 内，以 **自己名字** 创建一个子文件夹。
- 在该子文件夹内提交本次作业相关的所有文件。
- PR 标题需包含 `HW{整数}`（如 `HW1`、`HW2`），可出现在标题任意位置

示例目录结构：
```
HW1/
  bean/
    2025-08-16-LC-1.js
    note.md
    HW1.m4a
HW2/
  zoey/
    question1.js
    question2.js
    note.md
    HW2.m4a
```

---

## 文件命名规则

### 1. LeetCode 题目
- 命名格式：
  ```
  {DATE-LC-QUESTION_NUMBER.js}
  ```
- 示例：
  ```
  2025-08-16-LC-704.js
  2025-08-16-LC-201.js
  ```

### 2. 八股文手写答案
- 文件名固定为：
  ```
  note.md
  ```

### 3. 录音文件
- 命名格式：
  ```
  {HW#.*}
  ```
- 示例：
  ```
  HW1.m4a
  HW2.mp3
  ```

### 4. Coding 作业
- 命名格式：
  ```
  {question1.js}, {question2.js}, ...
  ```
- 示例：
  ```
  question1.js
  question2.js
  ```

### 5. React 作业
- **仅提交自己写的 component**，不要提交整个项目。
- 示例：
  ```
  MyComponent.jsx
  AnotherCardComponent.jsx
  ```

---

## 提交示例

假设是 **HW1**，同学 **Bean** 的提交应如下所示：
```
HW1/
  Bean/
    2025-08-16-LC-1.js
    note.md
    HW1.m4a
```

---

## 如何创建Pull Request

### 1.为每次作业创建branch，比如`bean_x_hw_1`
![image](https://github.com/user-attachments/assets/7185e552-b04d-4892-917e-edd7efebef69)
### 2.创建Pull Request
Step 1.
![image](https://github.com/user-attachments/assets/8c818576-1796-49fe-ae55-d262ff1e6708)
Step 2.
![image](https://github.com/user-attachments/assets/ec1fc0e6-401d-4b5b-a7f0-7394326f306f)
Step 3.
![image](https://github.com/user-attachments/assets/1f4c1a9b-055f-486a-8c62-30949922e0ce)

---

## 注意事项
0. **严禁**直接commit到`main branch`
1. 请严格遵守命名和目录结构要求。
2. 不要在 PR 中提交**无关**文件（如 `.DS_Store`、整个 React 项目文件夹等）。
3. 每次 PR 只提交自己**当次**的作业内容。
4. 问答题请麻烦大家当作面试题来对待，也就是说，如果面试有这道题，写一个可以直接拿来读的答案。不要长篇大论，不要有图片或者表格，而是简练地把它们描述出来，抓住重点
5. Leetcode (Blind 75) 按照之前说的要至少每天做一道题
