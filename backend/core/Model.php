<?php
/**
 * Base Model Class
 */

abstract class Model {
    protected $db;
    protected $table;
    protected $primaryKey = 'id';
    protected $fillable = [];
    protected $hidden = [];
    protected $timestamps = true;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function find($id) {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1";
        $result = $this->db->fetch($sql, ['id' => $id]);
        
        if ($result) {
            return $this->hideFields($result);
        }
        
        return null;
    }
    
    public function findOrFail($id) {
        $result = $this->find($id);
        
        if (!$result) {
            throw new Exception("Record not found in {$this->table} with id: {$id}");
        }
        
        return $result;
    }
    
    public function all($orderBy = null, $direction = 'ASC') {
        $sql = "SELECT * FROM {$this->table}";
        
        if ($orderBy) {
            $sql .= " ORDER BY {$orderBy} {$direction}";
        }
        
        $results = $this->db->fetchAll($sql);
        return array_map([$this, 'hideFields'], $results);
    }
    
    public function where($column, $operator, $value = null) {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }
        
        $sql = "SELECT * FROM {$this->table} WHERE {$column} {$operator} :value";
        $results = $this->db->fetchAll($sql, ['value' => $value]);
        return array_map([$this, 'hideFields'], $results);
    }
    
    public function whereFirst($column, $operator, $value = null) {
        $results = $this->where($column, $operator, $value);
        return !empty($results) ? $results[0] : null;
    }
    
    public function paginate($page = 1, $limit = 20, $orderBy = null, $direction = 'ASC', $where = null, $whereParams = []) {
        $offset = ($page - 1) * $limit;
        
        // Count total records
        $countSql = "SELECT COUNT(*) as total FROM {$this->table}";
        if ($where) {
            $countSql .= " WHERE {$where}";
        }
        $totalResult = $this->db->fetch($countSql, $whereParams);
        $total = $totalResult['total'];
        
        // Get paginated data
        $sql = "SELECT * FROM {$this->table}";
        if ($where) {
            $sql .= " WHERE {$where}";
        }
        if ($orderBy) {
            $sql .= " ORDER BY {$orderBy} {$direction}";
        }
        $sql .= " LIMIT {$limit} OFFSET {$offset}";
        
        $results = $this->db->fetchAll($sql, $whereParams);
        $data = array_map([$this, 'hideFields'], $results);
        
        return [
            'data' => $data,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ];
    }
    
    public function create($data) {
        $data = $this->filterFillable($data);
        
        if ($this->timestamps) {
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
        }
        
        $id = $this->db->insert($this->table, $data);
        return $this->find($id);
    }
    
    public function update($id, $data) {
        $data = $this->filterFillable($data);
        
        if ($this->timestamps) {
            $data['updated_at'] = date('Y-m-d H:i:s');
        }
        
        $affected = $this->db->update(
            $this->table, 
            $data, 
            "{$this->primaryKey} = :id", 
            ['id' => $id]
        );
        
        if ($affected > 0) {
            return $this->find($id);
        }
        
        return null;
    }
    
    public function delete($id) {
        return $this->db->delete(
            $this->table, 
            "{$this->primaryKey} = :id", 
            ['id' => $id]
        );
    }
    
    public function exists($id) {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE {$this->primaryKey} = :id";
        $result = $this->db->fetch($sql, ['id' => $id]);
        return $result['count'] > 0;
    }
    
    protected function filterFillable($data) {
        if (empty($this->fillable)) {
            return $data;
        }
        
        return array_intersect_key($data, array_flip($this->fillable));
    }
    
    protected function hideFields($data) {
        if (empty($this->hidden) || !is_array($data)) {
            return $data;
        }
        
        foreach ($this->hidden as $field) {
            unset($data[$field]);
        }
        
        return $data;
    }
    
    public function beginTransaction() {
        return $this->db->beginTransaction();
    }
    
    public function commit() {
        return $this->db->commit();
    }
    
    public function rollback() {
        return $this->db->rollback();
    }
    
    public function query($sql, $params = []) {
        return $this->db->query($sql, $params);
    }
    
    public function fetch($sql, $params = []) {
        return $this->db->fetch($sql, $params);
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->db->fetchAll($sql, $params);
    }
    
    public function getTable() {
        return $this->table;
    }
    
    public function getPrimaryKey() {
        return $this->primaryKey;
    }
    
    public function getFillable() {
        return $this->fillable;
    }
    
    public function getHidden() {
        return $this->hidden;
    }
    
    public function hasTimestamps() {
        return $this->timestamps;
    }
}
